import { useParams, Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Stethoscope, ArrowLeft, Calendar, Tag } from "lucide-react";
import { articlesData } from "../../data/articles";

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const article = articlesData.find((a) => a.id === id);

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Artikel Tidak Ditemukan</h1>
        <Link to="/">
          <Button>Kembali ke Beranda</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-200">
      {/* Header/Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg shadow-md shadow-blue-500/20">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <h1 className="font-display font-bold text-xl text-slate-800 tracking-tight">
              Diabetic<span className="text-blue-600">Care</span>
            </h1>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" className="rounded-xl text-slate-600 hover:bg-slate-100 font-medium">
                <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Beranda
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Article Content */}
      <main className="pt-32 pb-24 px-6 max-w-3xl mx-auto">
        <article className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
          <img 
            src={article.imageUrl} 
            alt={article.title} 
            className="w-full h-[300px] md:h-[400px] object-cover"
          />
          <div className="p-8 md:p-12">
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-6">
              <span className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
                <Tag className="w-4 h-4 mr-2" />
                {article.category}
              </span>
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {article.date}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-6 leading-tight">
              {article.title}
            </h1>
            
            <div className="prose prose-lg prose-slate max-w-none">
              {/* Splitting content by newlines to render paragraphs */}
              {article.content.split('\\n\\n').map((paragraph, index) => (
                <p key={index} className="text-slate-600 leading-relaxed mb-6">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </article>
      </main>

      {/* Footer minimal */}
      <footer className="bg-slate-900 py-8 border-t-4 border-blue-600 text-slate-400 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Zikra - Edukasi Medis Sistem DiabeticCare.</p>
      </footer>
    </div>
  );
}
