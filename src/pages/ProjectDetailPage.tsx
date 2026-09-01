import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { fetchProjectBySlug } from '../firebase/services';
import { Project } from '../types';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle, Lightbulb, Target, Layers, Loader2 } from 'lucide-react';

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (slug) {
        setLoading(true);
        const data = await fetchProjectBySlug(slug);
        setProject(data);
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  if (loading) {
    return (
      <Layout title="Project Case Study">
        <div className="py-32 text-center flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
          <p className="text-slate-400 text-sm">Loading project details...</p>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout title="Project Not Found">
        <div className="py-24 max-w-xl mx-auto text-center space-y-6 px-4">
          <h1 className="text-3xl font-bold text-slate-100">Project Case Study Not Found</h1>
          <p className="text-slate-400 text-sm">
            The project case study you requested could not be located or has been updated.
          </p>
          <Button to="/work" variant="primary" icon={<ArrowLeft className="w-4 h-4" />}>
            Back to Work Showcase
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={project.title} description={project.description}>
      {/* Top Header */}
      <section className="py-12 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <Link to="/work" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-brand-400 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio Showcase
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <Badge variant={project.projectStatus === 'Concept Project' ? 'concept' : 'demo'}>
              {project.projectStatus}
            </Badge>
            <span className="text-xs font-semibold text-brand-400 bg-slate-900 px-3 py-1 rounded-md border border-slate-800">
              {project.category}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-100 leading-tight">
            {project.title}
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed max-w-3xl">
            {project.description}
          </p>
        </div>
      </section>

      {/* Main Content Showcase */}
      <section className="py-16 space-y-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Main Screenshot Header Image */}
          <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900">
            <img
              src={project.images[0]}
              alt={project.title}
              className="w-full max-h-[500px] object-cover"
            />
          </div>

          {/* Overview Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">
              {/* Overview */}
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-brand-400" />
                  Project Overview
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {project.overview}
                </p>
              </div>

              {/* Business Problem vs Proposed Solution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="space-y-3 border-red-500/20 bg-red-950/10">
                  <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Business Problem</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    {project.businessProblem}
                  </p>
                </Card>

                <Card className="space-y-3 border-emerald-500/20 bg-emerald-950/10">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <Lightbulb className="w-4 h-4" />
                    <span>Proposed Solution</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    {project.solution}
                  </p>
                </Card>
              </div>

              {/* Key Features */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-100">Key Functional Features</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {project.features.map((feat, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-200 font-medium">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Secondary Gallery Images */}
              {project.images.length > 1 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-slate-100">System Screenshots & Interface Views</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {project.images.slice(1).map((img, idx) => (
                      <div key={idx} className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
                        <img src={img} alt={`${project.title} preview ${idx + 2}`} className="w-full h-48 object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar Metadata */}
            <div className="space-y-6">
              <Card className="space-y-6 border-slate-800">
                {/* Tech Stack */}
                <div className="space-y-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Technologies Used</span>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, idx) => (
                      <Badge key={idx} variant="slate">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Project Objective (Honest Metric approach without fake statistics) */}
                <div className="pt-4 border-t border-slate-800 space-y-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-brand-400" />
                    <span>Project Objective</span>
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-950 p-3 rounded-xl border border-slate-800">
                    "{project.objective}"
                  </p>
                </div>

                {/* CTA Link */}
                <div className="pt-4 border-t border-slate-800">
                  <Button
                    to={`/contact?service=${encodeURIComponent(project.title)}`}
                    variant="primary"
                    fullWidth
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    Build Similar Solution
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};
