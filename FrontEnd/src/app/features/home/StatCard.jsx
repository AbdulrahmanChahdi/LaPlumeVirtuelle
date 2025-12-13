import Card from "../../components/ui/Card"

export default function StatCard({ title, value, subtitle }) {
  return (
    <Card className="h-40 flex flex-col justify-center text-center">
      <h3 className="text-sm text-inkSoft mb-1">{title}</h3>
      <p className="text-xl font-semibold text-accent">{value}</p>
      <p className="text-xs text-inkMuted mt-1">{subtitle}</p>
    </Card>
  )
}
