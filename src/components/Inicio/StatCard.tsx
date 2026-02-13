type Props = {
  title: string
  value: number | string
  icon: string
  color?: "blue" | "green" | "orange" | "purple" | "red"
  subtitle?: string
}

export function StatCard({ title, value, icon, color = "blue", subtitle }: Props) {
  const colorClasses = {
    blue: "bg-blue-500 text-blue-500 bg-blue-50",
    green: "bg-green-500 text-green-500 bg-green-50",
    orange: "bg-orange-500 text-orange-500 bg-orange-50",
    purple: "bg-purple-500 text-purple-500 bg-purple-50",
    red: "bg-red-500 text-red-500 bg-red-50"
  }

  const [textColor, bgLight] = colorClasses[color].split(" ")

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
        <div className={`${bgLight} ${textColor} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
          {icon}
        </div>
      </div>
      
      <div className={`text-3xl font-bold ${textColor} mb-1`}>
        {value}
      </div>
      
      {subtitle && (
        <p className="text-gray-500 text-xs">{subtitle}</p>
      )}
    </div>
  )
}