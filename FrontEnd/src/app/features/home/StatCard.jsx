import Card from "../../components/ui/Card"

export default function StatCard({ title, value, subtitle }) {
  return (
    <Card className="text-center">
      <h3 className="text-sm text-inkSoft mb-1">{title}</h3>
      <p className="text-2xl font-bold text-accent">{value}</p>
      <p className="text-xs text-inkMuted">{subtitle}</p>

    </Card>
  )
}
