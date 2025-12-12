import StatCard from "./StatCard"

export default function HomeStats() {
    const stats = [
        {
            title: "Livre le plus lu",
            value: "📖 L’Odyssée",
            subtitle: "12 430 lectures",
        },
        {
            title: "Livre audio le plus écouté",
            value: "🎧 Les Misérables",
            subtitle: "8 210 écoutes",
        },
        {
            title: "Podcast le plus populaire",
            value: "🎙️ Histoire & Civilisations",
            subtitle: "5 980 téléchargements",
        },
    ]

    return (
        <section className="bg-paperSoft py-20">
            <div className="max-w-7xl mx-auto px-6">

                <h2 className="text-2xl font-bold text-center mb-6">
                    Tendances actuelles
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                    {stats.map((stat, index) => (
                        <StatCard key={index} {...stat} />
                    ))}
                </div>

            </div>
        </section>

    )
}
