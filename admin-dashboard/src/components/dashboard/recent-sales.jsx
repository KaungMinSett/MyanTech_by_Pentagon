const getInitials = (name) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[1][0]}`;
    }
    return names[0][0];
  };
  
  export function RecentSales() {
    const sales = [
      {
        name: "Olivia Martin",
        email: "olivia.martin@email.com",
        amount: "+$1,999.00"
      },
      {
        name: "Jackson Lee",
        email: "jackson.lee@email.com",
        amount: "+$39.00"
      },
      {
        name: "Isabella Nguyen",
        email: "isabella.nguyen@email.com",
        amount: "+$299.00"
      }
    ];
  
    return (
      <div className="space-y-8">
        {sales.map((sale) => (
          <div key={sale.email} className="flex items-center">
            <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
              {getInitials(sale.name)}
            </div>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">{sale.name}</p>
              <p className="text-sm text-muted-foreground">{sale.email}</p>
            </div>
            <div className="ml-auto font-medium">{sale.amount}</div>
          </div>
        ))}
      </div>
    )
  }