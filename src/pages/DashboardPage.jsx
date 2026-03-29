import { useAppStore } from '../store/useAppStore';

const DashboardPage = () => {
  const user = useAppStore((s) => s.user);
  const cards = [
    { label: 'Active schemes', value: '24' },
    { label: 'Pending escalations', value: '7' },
    { label: 'Community posts', value: '193' },
  ];

  return (
    <div className="space-y-4">
      <div className="card p-6">
        <h2 className="text-xl font-semibold">Welcome, {user?.name || 'Farmer'}</h2>
        <p className="text-slate-500 dark:text-slate-300">Role based control panel for farmers, officers and admins.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="card p-5">
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="text-3xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
