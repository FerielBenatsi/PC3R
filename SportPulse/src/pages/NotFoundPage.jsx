import { useNavigate } from 'react-router-dom'

export default function NotFoundPage({ dark }) {
  const navigate = useNavigate()

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center gap-6 px-4 ${
      dark ? 'text-white' : 'text-slate-800'
    }`}>
      <span className="text-8xl font-bold text-green-500">404</span>
      <p className="text-xl opacity-60">Cette page n'existe pas.</p>
      <button
        onClick={() => navigate('/')}
        className="px-6 py-2 rounded-xl bg-green-500 text-black font-semibold hover:bg-green-400 transition-colors"
      >
        Retour à l'accueil
      </button>
    </div>
  )
}