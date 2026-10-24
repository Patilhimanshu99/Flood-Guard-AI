
import React, { useEffect, useState } from 'react';

export default function MLClusterAnalysis() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClusters = async () => {
      try {
        const response = await fetch('/api/ml/clusters');

        if (!response.ok) {
          throw new Error(`Unable to load ML results (${response.status})`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message || 'Failed to load cluster analysis.');
      } finally {
        setLoading(false);
      }
    };

    fetchClusters();
  }, []);

  const formatNumber = (value) =>
    Number(value).toLocaleString('en-IN', {
      maximumFractionDigits: 2,
    });

  const cardStyle = {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '18px',
  };

  return (
    <section
      style={{
        marginTop: '24px',
        marginBottom: '24px',
        padding: '24px',
        background: '#f1f5f9',
        borderRadius: '14px',
        border: '1px solid #e2e8f0',
      }}
    >
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: '#0f172a', fontSize: '22px' }}>
          ML Cluster Analysis
        </h2>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: 0 }}>
          K-Means analysis of rainfall and terrain patterns
        </p>
      </div>

      {loading && (
        <p style={{ color: '#475569' }}>
          Loading ML cluster results...
        </p>
      )}

      {error && (
        <div
          style={{
            ...cardStyle,
            color: '#b91c1c',
            borderColor: '#fecaca',
          }}
        >
          {error}
        </div>
      )}

      {data && !loading && (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '14px',
              marginBottom: '18px',
            }}
          >
            <div style={cardStyle}>
              <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>
                Algorithm
              </p>
              <h3 style={{ marginBottom: 0, color: '#0f172a' }}>
                {data.algorithm}
              </h3>
            </div>

            <div style={cardStyle}>
              <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>
                Number of Clusters
              </p>
              <h3 style={{ marginBottom: 0, color: '#0f172a', fontSize: '28px' }}>
                {data.cluster_count}
              </h3>
            </div>

            <div style={cardStyle}>
              <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>
                Total Observations
              </p>
              <h3 style={{ marginBottom: 0, color: '#0f172a', fontSize: '28px' }}>
                {formatNumber(data.total_observations)}
              </h3>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px',
            }}
          >
            {data.clusters.map((cluster) => (
              <div
                key={cluster.ml_cluster}
                style={{
                  ...cardStyle,
                  borderTop: '4px solid #0891b2',
                }}
              >
                <h3 style={{ marginTop: 0, color: '#0f172a' }}>
                  Cluster {cluster.ml_cluster}
                </h3>

                <p style={{ color: '#64748b', fontSize: '13px' }}>
                  {formatNumber(cluster.observations)} observations
                </p>

                <div style={{ fontSize: '14px', color: '#334155', lineHeight: 1.9 }}>
                  <div>
                    <strong>Daily rainfall:</strong>{' '}
                    {formatNumber(cluster.avg_daily_rainfall_mm)} mm
                  </div>
                  <div>
                    <strong>3-day rainfall:</strong>{' '}
                    {formatNumber(cluster.avg_3day_rainfall_mm)} mm
                  </div>
                  <div>
                    <strong>7-day rainfall:</strong>{' '}
                    {formatNumber(cluster.avg_7day_rainfall_mm)} mm
                  </div>
                  <div>
                    <strong>Average elevation:</strong>{' '}
                    {formatNumber(cluster.avg_elevation_m)} m
                  </div>
                  <div>
                    <strong>Average slope:</strong>{' '}
                    {formatNumber(cluster.avg_slope_deg)}°
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p
            style={{
              marginTop: '18px',
              marginBottom: 0,
              padding: '12px',
              background: '#e0f2fe',
              color: '#075985',
              borderRadius: '8px',
              fontSize: '13px',
              lineHeight: 1.6,
            }}
          >
            <strong>Important:</strong>{' '}
            {data.note ||
              'These clusters describe environmental patterns and are not verified flood-risk classifications.'}
          </p>
        </>
      )}
    </section>
  );
}
