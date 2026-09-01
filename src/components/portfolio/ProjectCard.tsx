import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { Project } from '../../types';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <Card className="flex flex-col justify-between p-0 overflow-hidden group">
      {/* Project Mockup Image */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-900">
        <img
          src={project.images[0]}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-dark-card/40 to-transparent" />
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge variant={project.projectStatus === 'Concept Project' ? 'concept' : 'demo'}>
            {project.projectStatus}
          </Badge>
        </div>

        {/* Category Pill */}
        <div className="absolute bottom-3 left-4">
          <span className="text-xs font-semibold text-brand-400 bg-slate-950/80 px-2.5 py-1 rounded-md border border-slate-800 backdrop-blur-md">
            {project.category}
          </span>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-xl font-bold text-slate-100 group-hover:text-brand-400 transition-colors">
            {project.title}
          </h3>
          <p className="text-slate-400 text-sm mt-2 leading-relaxed line-clamp-2">
            {project.description}
          </p>

          {/* Key Features Preview */}
          <div className="mt-4 space-y-1.5">
            <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Key Features</div>
            {project.features.slice(0, 3).map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-slate-400">
                <Check className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                <span className="truncate">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Technologies Badges */}
        <div className="pt-2">
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.technologies.slice(0, 4).map((tech, idx) => (
              <Badge key={idx} variant="slate">
                {tech}
              </Badge>
            ))}
          </div>

          {/* Action Link */}
          <Link
            to={`/projects/${project.slug}`}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-brand-500 hover:text-slate-950 text-slate-200 font-semibold text-sm transition-all duration-300 border border-slate-700/60"
          >
            <span>View Case Study</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </Card>
  );
};
