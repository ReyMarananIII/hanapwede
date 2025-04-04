import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
export default function Header() {
  const navigate = useNavigate();
  return (
    <header className="flex h-16 items-center justify-between  px-4 lg:px-16">
      <Link to="/" className="flex items-center">
        <img
          src="/hanapwedelogo.png"
          alt="Logo"
          className="h-8 w-auto"
        />
      </Link>
      <div className="flex items-center gap-4">
        <Link to="/job-seeker/signin" className="text-sm text-muted-foreground hover:text-foreground">
          Job Seeker Login
        </Link>
        <Link to="/employer/signin" className="text-sm text-muted-foreground hover:text-foreground">
          Employer Login
        </Link>
        <button 
   onClick={() => navigate("/employer/signin?redirect=/employer/post-job")}
   className="bg-[#4CAF50] hover:bg-[#45a049] px-4 py-2 text-sm text-white rounded">
   Post a Job
</button>
      </div>
    </header>
  )
}

