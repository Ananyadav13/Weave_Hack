// components/onboarding/SkillsForm.tsx

"use client";


import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { AlertCircle, Check, ChevronRight, Image, Trash2, Upload, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";

interface Skill {
  id: string;
  name: string;
  level: string;
  certificates: Certificate[];
}

interface Certificate {
  id: string;
  name: string;
  file?: File;
  uploaded: boolean;
}

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  images: ProjectImage[];
}

interface ProjectImage {
  id: string;
  name: string;
  file?: File;
  preview: string;
}

export default function SkillsForm() {
  const [step, setStep] = useState(1);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [currentSkill, setCurrentSkill] = useState('');
  const [skillLevel, setSkillLevel] = useState('Intermediate');
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState({
    name: '',
    description: '',
    technology: ''
  });
  const [projectTechnologies, setProjectTechnologies] = useState<string[]>([]);
  const [projectImages, setProjectImages] = useState<ProjectImage[]>([]);
  const [progress, setProgress] = useState(25);

  const handleAddSkill = () => {
    if (currentSkill.trim() !== '') {
      const newSkill: Skill = {
        id: Date.now().toString(),
        name: currentSkill,
        level: skillLevel,
        certificates: [...certificates]
      };
      setSkills([...skills, newSkill]);
      setCurrentSkill('');
      setCertificates([]);
    }
  };

  const handleRemoveSkill = (id: string) => {
    setSkills(skills.filter(skill => skill.id !== id));
  };

  const handleAddCertificate = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newCertificate: Certificate = {
        id: Date.now().toString(),
        name: file.name,
        file: file,
        uploaded: false
      };
      setCertificates([...certificates, newCertificate]);
    }
  };

  const handleRemoveCertificate = (id: string) => {
    setCertificates(certificates.filter(cert => cert.id !== id));
  };

  const handleAddTechnology = () => {
    if (currentProject.technology.trim() !== '') {
      setProjectTechnologies([...projectTechnologies, currentProject.technology.trim()]);
      setCurrentProject({ ...currentProject, technology: '' });
    }
  };

  const handleRemoveTechnology = (tech: string) => {
    setProjectTechnologies(projectTechnologies.filter(t => t !== tech));
  };

  const handleAddProjectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages: ProjectImage[] = [];
      
      Array.from(e.target.files).forEach(file => {
        const imageUrl = URL.createObjectURL(file);
        newImages.push({
          id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
          name: file.name,
          file: file,
          preview: imageUrl
        });
      });
      
      setProjectImages([...projectImages, ...newImages]);
    }
  };

  const handleRemoveProjectImage = (id: string) => {
    const imageToRemove = projectImages.find(img => img.id === id);
    if (imageToRemove && imageToRemove.preview) {
      URL.revokeObjectURL(imageToRemove.preview);
    }
    setProjectImages(projectImages.filter(img => img.id !== id));
  };

  const handleAddProject = () => {
    if (currentProject.name.trim() !== '') {
      const newProject: Project = {
        id: Date.now().toString(),
        name: currentProject.name,
        description: currentProject.description,
        technologies: [...projectTechnologies],
        images: [...projectImages]
      };
      setProjects([...projects, newProject]);
      setCurrentProject({ name: '', description: '', technology: '' });
      setProjectTechnologies([]);
      setProjectImages([]);
    }
  };

  const handleRemoveProject = (id: string) => {
    // Revoke object URLs for images before removing the project
    const projectToRemove = projects.find(p => p.id === id);
    if (projectToRemove) {
      projectToRemove.images.forEach(img => {
        if (img.preview) {
          URL.revokeObjectURL(img.preview);
        }
      });
    }
    setProjects(projects.filter(project => project.id !== id));
  };

  const handleNext = async () => {
    if (step < 4) {
      setStep(step + 1);
      setProgress(step === 1 ? 50 : step === 2 ? 75 : 100);
    } else {
      try {
        // First, save the skills
        const skillsResponse = await fetch('/api/onboarding/skills', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ skills })
        });
        
        if (!skillsResponse.ok) {
          throw new Error('Failed to save skills');
        }
        
        // Save the projects
        const projectsResponse = await fetch('/api/onboarding/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projects })
        });
        
        if (!projectsResponse.ok) {
          throw new Error('Failed to save projects');
        }
        
        // Upload certificates if they exist
        for (const skill of skills) {
          for (const cert of skill.certificates) {
            if (cert.file) {
              const formData = new FormData();
              formData.append('file', cert.file);
              formData.append('skillId', skill.id);
              
              const certResponse = await fetch('/api/onboarding/certificates', {
                method: 'POST',
                body: formData
              });
              
              if (!certResponse.ok) {
                throw new Error('Failed to upload certificate');
              }
            }
          }
        }
        
        // Upload project images if they exist
        for (const project of projects) {
          for (const image of project.images) {
            if (image.file) {
              const formData = new FormData();
              formData.append('file', image.file);
              formData.append('projectId', project.id);
              
              const imageResponse = await fetch('/api/onboarding/project-images', {
                method: 'POST',
                body: formData
              });
              
              if (!imageResponse.ok) {
                throw new Error('Failed to upload project image');
              }
            }
          }
        }
        
        // Mark onboarding as complete
        const completeResponse = await fetch('/api/onboarding/complete', {
          method: 'POST'
        });
        
        if (!completeResponse.ok) {
          throw new Error('Failed to complete onboarding');
        }
        
        // Redirect to dashboard after successful completion
        window.location.href = "/dashboard";
      } catch (error) {
        console.error('Error during onboarding:', error);
        // Handle error (show error message to user)
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setProgress(step === 2 ? 25 : step === 3 ? 50 : 75);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 pt-20">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader className="border-b pb-3">
          <CardTitle className="text-2xl font-bold text-purple-600">Complete Your Profile</CardTitle>
          <CardDescription>Let us know your skills and expertise</CardDescription>
          <Progress value={progress} className="h-2 mt-4" />
        </CardHeader>

        <CardContent className="pt-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Add Your Skills</h3>
                <p className="text-sm text-gray-500">What skills would you like to showcase?</p>
              </div>
              
              <div className="flex space-x-2">
                <div className="flex-1">
                  <Input 
                    placeholder="Enter a skill (e.g. React, JavaScript, UI Design)" 
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                  />
                </div>
                <div>
                  <select 
                    className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    value={skillLevel}
                    onChange={(e) => setSkillLevel(e.target.value)}
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                    <option>Expert</option>
                  </select>
                </div>
                <Button onClick={handleAddSkill} type="button" className="bg-purple-600 hover:bg-purple-700">
                  Add
                </Button>
              </div>
              
              <div className="mt-4">
                <h4 className="mb-2 text-sm font-medium">Your skills:</h4>
                <div className="flex flex-wrap gap-2">
                  {skills.length === 0 ? (
                    <p className="text-sm text-gray-500">No skills added yet</p>
                  ) : (
                    skills.map(skill => (
                      <Badge key={skill.id} className="pl-2 pr-1 py-1 flex items-center gap-1 bg-purple-100 text-purple-800 hover:bg-purple-200">
                        {skill.name} ({skill.level})
                        <button 
                          className="ml-1 rounded-full hover:bg-purple-200 p-0.5" 
                          onClick={() => handleRemoveSkill(skill.id)}
                        >
                          <X size={14} />
                        </button>
                      </Badge>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Upload Certificates</h3>
                <p className="text-sm text-gray-500">Add certificates to verify your skills</p>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm font-medium text-gray-900">Drag and drop file or</p>
                <div className="mt-2">
                  <Label 
                    htmlFor="certificate-upload" 
                    className="inline-flex cursor-pointer items-center rounded-md bg-purple-600 px-3 py-2 text-sm font-medium text-white hover:bg-purple-700"
                  >
                    Browse Files
                  </Label>
                  <Input 
                    id="certificate-upload" 
                    type="file" 
                    className="hidden" 
                    onChange={handleAddCertificate}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Support for PDF, PNG, JPG (Max: 5MB)</p>
              </div>
              
              {certificates.length > 0 && (
                <div className="mt-4">
                  <h4 className="mb-2 text-sm font-medium">Selected certificates:</h4>
                  <div className="space-y-2">
                    {certificates.map(cert => (
                      <div key={cert.id} className="flex items-center justify-between rounded-lg border p-3">
                        <div className="flex items-center">
                          <div className="rounded-md bg-purple-100 p-2 mr-3">
                            <Check size={16} className="text-purple-600" />
                          </div>
                          <div className="text-sm">
                            <p className="font-medium">{cert.name}</p>
                            <p className="text-gray-500 text-xs">
                              {cert.file ? `${Math.round(cert.file.size / 1024)} KB` : ''}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveCertificate(cert.id)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

{step === 3 && (
  <div className="space-y-4">
    <div>
      <h3 className="text-lg font-medium">Showcase Your Projects</h3>
      <p className="text-sm text-gray-500">Add projects to demonstrate your skills in action</p>
    </div>
    
    <div className="space-y-4 border rounded-lg p-4">
      <div>
        <Label htmlFor="project-name" className="text-sm font-medium">Project Name</Label>
        <Input 
          id="project-name"
          placeholder="Enter project name" 
          value={currentProject.name}
          onChange={(e) => setCurrentProject({...currentProject, name: e.target.value})}
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="project-description" className="text-sm font-medium">Project Description</Label>
        <Textarea 
          id="project-description"
          placeholder="Describe your project" 
          value={currentProject.description}
          onChange={(e) => setCurrentProject({...currentProject, description: e.target.value})}
          className="mt-1"
          rows={3}
        />
      </div>
      
      <div>
        <Label className="text-sm font-medium">Technologies Used</Label>
        <div className="flex space-x-2 mt-1">
          <Input 
            placeholder="Add technologies (e.g. React, Node.js)" 
            value={currentProject.technology}
            onChange={(e) => setCurrentProject({...currentProject, technology: e.target.value})}
            className="flex-1"
          />
          <Button 
            onClick={handleAddTechnology} 
            type="button" 
            className="bg-purple-600 hover:bg-purple-700"
          >
            Add
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {projectTechnologies.map((tech, index) => (
            <Badge key={index} className="pl-2 pr-1 py-1 flex items-center gap-1 bg-purple-100 text-purple-800 hover:bg-purple-200">
              {tech}
              <button 
                className="ml-1 rounded-full hover:bg-purple-200 p-0.5" 
                onClick={() => handleRemoveTechnology(tech)}
              >
                <X size={14} />
              </button>
            </Badge>
          ))}
        </div>
      </div>
      
      <div>
        <Label className="text-sm font-medium">Project Images</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 mt-1 text-center">
          <Image className="mx-auto h-10 w-10 text-gray-400" />
          <p className="mt-1 text-sm font-medium text-gray-900">Add screenshots or photos</p>
          <div className="mt-2">
            <Label 
              htmlFor="project-image-upload" 
              className="inline-flex cursor-pointer items-center rounded-md bg-purple-600 px-3 py-2 text-sm font-medium text-white hover:bg-purple-700"
            >
              Upload Images
            </Label>
            <Input 
              id="project-image-upload" 
              type="file"
              accept="image/*"
              multiple
              className="hidden" 
              onChange={handleAddProjectImage}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">PNG, JPG up to 5MB (Max: 5 images)</p>
        </div>
        
        {projectImages.length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {projectImages.map(img => (
              <div key={img.id} className="relative group rounded-lg overflow-hidden border">
                <img 
                  src={img.preview} 
                  alt={img.name}
                  className="h-32 w-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveProjectImage(img.id)}
                    className="text-white hover:text-red-300"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
                <div className="p-1 text-xs truncate bg-white">{img.name}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Button 
        onClick={handleAddProject} 
        disabled={!currentProject.name.trim()} 
        className="w-full bg-purple-600 hover:bg-purple-700 mt-2"
      >
        Add Project
      </Button>
    </div>
    
    {projects.length > 0 && (
      <div className="mt-6">
        <h4 className="text-lg font-medium mb-3">Your Projects ({projects.length})</h4>
        <div className="space-y-4">
          {projects.map(project => (
            <div key={project.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <h5 className="text-md font-semibold">{project.name}</h5>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveProject(project.id)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
              
              <p className="text-sm text-gray-600 mt-1">{project.description}</p>
              
              <div className="flex flex-wrap gap-1 mt-2">
                {project.technologies.map((tech, i) => (
                  <Badge key={i} className="bg-gray-100 text-gray-800">{tech}</Badge>
                ))}
              </div>
              
              {project.images.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {project.images.slice(0, 3).map(img => (
                    <div key={img.id} className="rounded-md overflow-hidden h-16">
                      <img 
                        src={img.preview} 
                        alt={img.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                  {project.images.length > 3 && (
                    <div className="rounded-md overflow-hidden h-16 bg-gray-200 flex items-center justify-center">
                      <span className="text-sm font-medium">+{project.images.length - 3} more</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
)}

          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Review Your Information</h3>
                <p className="text-sm text-gray-500">Please confirm your profile details</p>
              </div>
              
              <div className="rounded-lg border p-4">
                <h4 className="font-medium mb-2">Skills ({skills.length})</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {skills.map(skill => (
                    <Badge key={skill.id} className="bg-purple-100 text-purple-800">
                      {skill.name} ({skill.level})
                    </Badge>
                  ))}
                </div>
                
                <h4 className="font-medium mb-2">Certificates</h4>
                <div className="space-y-2 mb-4">
                  {skills.flatMap(skill => skill.certificates).length > 0 ? (
                    skills.flatMap(skill => 
                      skill.certificates.map(cert => (
                        <div key={cert.id} className="flex items-center text-sm">
                          <Check size={16} className="text-green-500 mr-2" />
                          {cert.name}
                        </div>
                      ))
                    )
                  ) : (
                    <p className="text-sm text-gray-500">No certificates uploaded</p>
                  )}
                </div>
                
                <h4 className="font-medium mb-2">Projects ({projects.length})</h4>
                {projects.length > 0 ? (
                  <div className="space-y-3">
                    {projects.map(project => (
                      <div key={project.id} className="border rounded p-3">
                        <h5 className="font-medium">{project.name}</h5>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{project.description}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {project.technologies.map((tech, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{tech}</Badge>
                          ))}
                        </div>
                        {project.images.length > 0 && (
                          <div className="mt-2 flex gap-1">
                            <Check size={16} className="text-green-500" />
                            <span className="text-sm">{project.images.length} project image(s)</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No projects added</p>
                )}
              </div>
              
              <Alert className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  You can edit your skills, certificates, and projects anytime from your profile page.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between border-t pt-4">
          {step > 1 ? (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          ) : (
            <div></div>
          )}
          <Button 
            onClick={handleNext} 
            className="bg-purple-600 hover:bg-purple-700"
            disabled={step === 1 && skills.length === 0}
          >
            {step === 4 ? 'Complete' : 'Continue'} 
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}   