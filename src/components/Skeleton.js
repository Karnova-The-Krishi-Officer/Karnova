import React from 'react';

const Skeleton = ({ lines = 4 }) => (
  <div className="skeleton-card">
    {Array.from({ length: lines }).map((_, idx) => (
      <div key={idx} className="skeleton-line" />
    ))}
  </div>
);

export default React.memo(Skeleton);
