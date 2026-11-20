import os
import sys
import pandas as pd
from neo4j import GraphDatabase

# =====================================================================
# 1. NEO4J AURADB CONFIGURATION
# Replace these strings with your actual Neo4j AuraDB credentials
# =====================================================================
# Optional Neo4j loader. The demo UI uses /api/graph from CSV instead.
# Create a new AuraDB instance and put credentials in backend/.env (never commit them).
NEO4J_URI = os.getenv("NEO4J_URI", "")
NEO4J_USERNAME = os.getenv("NEO4J_USERNAME", "")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "")

CSV_FILE_PATH = "DataCoSupplyChainDataset.csv"


class Neo4jKnowledgeGraph:
    def __init__(self, uri, user, password):
        try:
            self.driver = GraphDatabase.driver(uri, auth=(user, password))
            # Test connectivity
            self.driver.verify_connectivity()
            print("[✓] Successfully connected to Neo4j AuraDB Instance.")
        except Exception as e:
            print(f"[X] Connection Error: {e}")
            sys.exit(1)

    def close(self):
        self.driver.close()

    def create_constraints(self):
        """Creates unique constraints to ensure fast queries and no duplicates."""
        constraints = [
            "CREATE CONSTRAINT IF NOT EXISTS FOR (c:Customer) REQUIRE c.id IS UNIQUE;",
            "CREATE CONSTRAINT IF NOT EXISTS FOR (o:Order) REQUIRE o.id IS UNIQUE;",
            "CREATE CONSTRAINT IF NOT EXISTS FOR (p:Product) REQUIRE p.id IS UNIQUE;",
            "CREATE CONSTRAINT IF NOT EXISTS FOR (d:Department) REQUIRE d.name IS UNIQUE;"
        ]
        with self.driver.session() as session:
            for query in constraints:
                session.run(query)
        print("[✓] Schema constraints applied.")

    def ingest_records(self, df_records: list):
        """Batched Cypher query to construct Graph Nodes and Interconnections."""
        cypher_query = """
        UNWIND $batch AS row
        // 1. Create or match Customer node
        MERGE (c:Customer {id: row.customer_id})
        ON CREATE SET c.segment = row.customer_segment,
                      c.country = row.customer_country

        // 2. Create or match Order node
        MERGE (o:Order {id: row.order_id})
        ON CREATE SET o.date = row.order_date,
                      o.sales = row.sales,
                      o.profit = row.order_profit,
                      o.late_risk = row.late_delivery_risk,
                      o.real_shipping_days = row.real_shipping_days

        // 3. Create or match Department node
        MERGE (d:Department {name: row.department_name})

        // 4. Create or match Product node
        MERGE (p:Product {id: row.product_id})
        ON CREATE SET p.category = row.product_category

        // 5. Connect Relationships (Edges)
        MERGE (c)-[:PLACED]->(o)
        MERGE (o)-[:CONTAINS {quantity: row.order_item_quantity, discount: row.order_item_discount_rate}]->(p)
        MERGE (p)-[:BELONGS_TO]->(d)
        """
        with self.driver.session() as session:
            session.run(cypher_query, batch=df_records)
        print(f"[✓] Graph batch of {len(df_records)} transactions ingested into Neo4j.")

    def run_graph_diagnostics(self):
        """Verifies graph population by counting nodes and relationships."""
        diagnostic_query = """
        MATCH (c:Customer) WITH count(c) as customer_count
        MATCH (o:Order) WITH customer_count, count(o) as order_count
        MATCH (p:Product) WITH customer_count, order_count, count(p) as product_count
        MATCH (d:Department) WITH customer_count, order_count, product_count, count(d) as dept_count
        MATCH ()-[r]->() WITH customer_count, order_count, product_count, dept_count, count(r) as relationship_count
        RETURN customer_count, order_count, product_count, dept_count, relationship_count
        """
        with self.driver.session() as session:
            result = session.run(diagnostic_query).single()
            print("\n" + "="*50)
            print("       ENTERPRISE SEMANTIC GRAPH METRICS")
            print("="*50)
            print(f" Customers (Nodes)     : {result['customer_count']}")
            print(f" Orders (Nodes)        : {result['order_count']}")
            print(f" Products (Nodes)      : {result['product_count']}")
            print(f" Departments (Nodes)   : {result['dept_count']}")
            print(f" Active Links (Edges)  : {result['relationship_count']}")
            print("="*50 + "\n")


def build_knowledge_graph(sample_limit: int = 250):
    if not os.path.exists(CSV_FILE_PATH):
        print(f"Error: {CSV_FILE_PATH} not found in current folder.")
        return

    print(f"[*] Reading and preprocessing {sample_limit} transactions from CSV...")
    # Import the cleaning function directly from your Phase 1 file
    from dataco_ingestion import DataCoPipeline

    cleaned_df = DataCoPipeline.load_and_clean_data(CSV_FILE_PATH, sample_size=sample_limit)
    
    # Format order date to string for Cypher serialization
    cleaned_df['order_date'] = cleaned_df['order_date'].dt.strftime('%Y-%m-%d')
    records = cleaned_df.to_dict(orient="records")

    # Connect and populate
    kg = Neo4jKnowledgeGraph(NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD)
    try:
        kg.create_constraints()
        kg.ingest_records(records)
        kg.run_graph_diagnostics()
    finally:
        kg.close()


if __name__ == "__main__":
    build_knowledge_graph(sample_limit=250)