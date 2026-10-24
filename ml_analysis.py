
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

# Load dataset
df = pd.read_csv("data/rainfall_risk_features_updated.csv")

# Features used for clustering
features = [
    "rainfall_daily_mm",
    "rainfall_3d_mm",
    "rainfall_7d_mm",
    "elevation_m",
    "slope_deg"
]

X = df[features].copy()

# Reduce the effect of extreme rainfall values
rainfall_cols = [
    "rainfall_daily_mm",
    "rainfall_3d_mm",
    "rainfall_7d_mm"
]
X[rainfall_cols] = np.log1p(X[rainfall_cols])

# Scale features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Find a suitable number of clusters
scores = {}

for k in range(2, 6):
    model = KMeans(n_clusters=k, random_state=42, n_init=10)
    labels = model.fit_predict(X_scaled)
    score = silhouette_score(X_scaled, labels)
    scores[k] = score
    print(f"K = {k}, Silhouette Score = {score:.4f}")

# Select the best-scoring option
best_k = max(scores, key=scores.get)
print(f"\nSelected number of clusters: {best_k}")

# Train final clustering model
model = KMeans(
    n_clusters=best_k,
    random_state=42,
    n_init=10
)
df["ml_cluster"] = model.fit_predict(X_scaled)

# Save results
df.to_csv("data/rainfall_clusters.csv", index=False)

# Summarize each cluster in original units
print("\nCluster summary:")
print(
    df.groupby("ml_cluster")[
        ["rainfall_daily_mm", "rainfall_3d_mm",
         "rainfall_7d_mm", "elevation_m", "slope_deg"]
    ].mean().round(2)
)

print("\nResults saved to data/rainfall_clusters.csv")
