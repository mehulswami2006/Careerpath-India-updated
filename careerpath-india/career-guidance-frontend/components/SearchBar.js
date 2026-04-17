'use client';
import AppIcon from './AppIcon';

export function SearchBar({ value, onChange, placeholder = 'Search...', icon = 'search' }) {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <span style={{
        position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)',
        fontSize: '1rem', pointerEvents: 'none'
      }}>
        <AppIcon name={icon} size={16} color="var(--text-subtle)" />
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem',
          border: '1.5px solid var(--input-border)', borderRadius: '12px',
          fontSize: '0.875rem', background: 'var(--input-bg)', outline: 'none',
          transition: 'all 0.2s', color: 'var(--text)'
        }}
        onFocus={e => {
          e.target.style.borderColor = 'var(--primary)';
          e.target.style.boxShadow = '0 0 0 3px rgba(255,125,16,0.1)';
        }}
        onBlur={e => {
          e.target.style.borderColor = 'var(--input-border)';
          e.target.style.boxShadow = 'none';
        }}
      />
    </div>
  );
}

export function FilterPanel({ filters, activeFilter, onFilterChange, label = 'Filter:' }) {
  return (
    <div>
      {label && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '0.5rem' }}>{label}</div>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            style={{
              padding: '0.35rem 0.875rem', borderRadius: '999px',
              fontSize: '0.8125rem', fontWeight: '600', cursor: 'pointer',
              border: '1.5px solid',
              transition: 'all 0.15s',
              background: activeFilter === filter ? 'linear-gradient(135deg, #ff7d10, #f06006)' : 'var(--card)',
              borderColor: activeFilter === filter ? 'var(--primary)' : 'var(--border)',
              color: activeFilter === filter ? 'white' : 'var(--text-muted)',
            }}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SearchBar;
