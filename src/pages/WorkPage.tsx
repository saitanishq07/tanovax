import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { ProjectCard } from '../components/portfolio/ProjectCard';
import { fetchProjects } from '../firebase/services';
import { Project } from '../types';
import { Loader2, Filter } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const WorkPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Websites' | 'Business Applications'>('All');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchProjects();
      setProjects(data.filter(p => p.published));
      setLoading(false);
    };
    load();
  }, []);

  const filteredProjects = projects.filter(project => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Websites') {
      return project.category.includes('Website') || project.category.includes('Hospitality');
    }
    if (activeFilter === 'Business Applications') {
      return project.category.includes('Business Application') || project.category.includes('CRM');
    }
    return true;
  });

  return (
    <Layout
      title="Our Work | Websites & Business Applications | TanovaX"
      description="Explore TanovaX showcase & concept projects. Demonstrating custom business CRMs, billing systems, inventory portals, and modern websites."
    >
      {/* Header */}
      <section className="py-16 lg:py-24 border-b border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="text-brand-400 text-xs font-semibold uppercase tracking-widest">Our Work & Portfolio</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-100 leading-tight">
              Featured Concepts & Demo Applications
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              Explore our software architecture, user interface design, and functional business application capabilities.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Bar & Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mr-2">
              <Filter className="w-4 h-4 text-brand-400" />
              <span>Filter by Category:</span>
            </div>

            <button
              onClick={() => setActiveFilter('All')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeFilter === 'All'
                  ? 'bg-brand-500 text-slate-950 shadow-md shadow-brand-500/20'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              All Projects ({projects.length})
            </button>

            <button
              onClick={() => setActiveFilter('Websites')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeFilter === 'Websites'
                  ? 'bg-brand-500 text-slate-950 shadow-md shadow-brand-500/20'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              Websites
            </button>

            <button
              onClick={() => setActiveFilter('Business Applications')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeFilter === 'Business Applications'
                  ? 'bg-brand-500 text-slate-950 shadow-md shadow-brand-500/20'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              Business Applications
            </button>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
              <p className="text-slate-400 text-sm">Loading project portfolio...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-3">
              <p className="text-lg">No projects match the selected category.</p>
              <Button onClick={() => setActiveFilter('All')} variant="secondary" size="sm">
                Reset Category Filter
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};
