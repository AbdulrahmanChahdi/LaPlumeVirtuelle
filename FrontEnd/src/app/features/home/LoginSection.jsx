import Input from "../../components/ui/Input"
import Button from "../../components/ui/Button"

export default function LoginSection() {
  return (
    <section className="flex justify-center py-16">
      <div className="w-full max-w-md border rounded-lg p-6">

        <h3 className="text-xl font-semibold mb-4 text-center">
          Connexion
        </h3>

        <form className="space-y-4">
          <Input type="email" placeholder="E-mail" />
          <Input type="password" placeholder="Mot de passe" />

          <div className="flex items-center text-sm">
            <input type="checkbox" className="mr-2" />
            Se souvenir de moi
          </div>

          <Button fullWidth>
            Se connecter
          </Button>
        </form>

      </div>
    </section>
  )
}
