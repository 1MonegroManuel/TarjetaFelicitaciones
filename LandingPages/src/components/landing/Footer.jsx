export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-display font-bold text-white mb-4">
              MomentoCarta
            </h3>
            <p className="text-sm leading-relaxed">
              Crea experiencias únicas con cartas digitales que solo se abren en el momento perfecto.
            </p>
          </div>

          

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contacto</h4>
            <p className="text-sm">
              ¿Tienes alguna pregunta?<br />
              Estamos aquí para ayudarte.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm">
          <p>
            © {new Date().getFullYear()} MomentoCarta. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
