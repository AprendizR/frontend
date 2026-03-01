type Props = {
  title: string
  value: number | string
  icon: string
  color?: "blue" | "green" | "orange" | "purple" | "red"
  subtitle?: string
}

export function StatCard({ title, value, icon, color = "blue", subtitle }: Props) {
  const colorMap = {
    blue:   { text: "text-blue-400",   iconBg: "bg-blue-500/20",   bar: "bg-blue-500" },
    green:  { text: "text-green-400",  iconBg: "bg-green-500/20",  bar: "bg-green-500" },
    orange: { text: "text-orange-400", iconBg: "bg-orange-500/20", bar: "bg-orange-500" },
    purple: { text: "text-purple-400", iconBg: "bg-purple-500/20", bar: "bg-purple-500" },
    red:    { text: "text-red-400",    iconBg: "bg-red-500/20",    bar: "bg-red-500" },
  }

  const c = colorMap[color]

  return (
    <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-6 hover:border-[#334155] transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
        <div className={`${c.iconBg} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
          {icon}
        </div>
      </div>

      <div className={`text-3xl font-bold ${c.text} mb-3`}>{value}</div>

      <div className="w-full h-1.5 bg-[#1e293b] rounded-full">
        <div className={`h-1.5 ${c.bar} rounded-full w-3/4`} />
      </div>

      {subtitle && <p className="text-slate-600 text-xs mt-2">{subtitle}</p>}
    </div>
  )
}