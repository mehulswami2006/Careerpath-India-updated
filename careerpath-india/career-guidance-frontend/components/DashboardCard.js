import AppIcon from './AppIcon';

export default function DashboardCard({ title, value, subtitle, icon, color = '#ff7d10', trend }) {
  return (
    <div style={{
      background: 'var(--card)', borderRadius: '16px', padding: '1.5rem',
      border: '1px solid var(--border)', boxShadow: 'var(--shadow-subtle)',
      transition: 'all 0.2s', cursor: 'default',
      position: 'relative', overflow: 'hidden'
    }}
    onMouseEnter={e => {
      e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
      e.currentTarget.style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.boxShadow = 'var(--shadow-subtle)';
      e.currentTarget.style.transform = 'translateY(0)';
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px',
        borderRadius: '50%', background: color, opacity: 0.08
      }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: '500', marginBottom: '0.5rem' }}>
            {title}
          </div>
          <div style={{ fontSize: '1.875rem', fontWeight: '800', color: 'var(--text)', lineHeight: 1 }}>
            {value}
          </div>
          {subtitle && (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.4rem' }}>{subtitle}</div>
          )}
          {trend && (
            <div style={{ fontSize: '0.75rem', color: trend > 0 ? '#10b981' : '#ef4444', marginTop: '0.4rem', fontWeight: '600' }}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last week
            </div>
          )}
        </div>
        <div style={{
          width: '48px', height: '48px', borderRadius: '12px',
          background: `linear-gradient(135deg, ${color}20, ${color}10)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.5rem', border: `1px solid ${color}30`
        }}>
          {typeof icon === 'string' ? <AppIcon name={icon} size={22} color={color} /> : icon}
        </div>
      </div>
    </div>
  );
}
