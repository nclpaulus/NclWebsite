export interface LabExperiment {
	slug: string;
	title: string;
	description: string;
	problem: string;
	solution: string;
	techStack: string[];
	liveUrl?: string;
	sourceUrl?: string;
	type: 'demo' | 'tool' | 'poc';
	date: string;
	difficulty: 'easy' | 'medium' | 'hard';
	tags: string[];
}

export interface Project {
	slug: string;
	title: string;
	description: string;
	context: string;
	techStack: string[];
	liveUrl: string;
	githubUrl: string;
	type: 'real' | 'mock' | 'demo';
	features: string[];
	date: string;
	client?: string;
	status: 'completed' | 'in-progress' | 'prototype';
	tags: string[];
}

export interface ContentCard {
	slug: string;
	title: string;
	description: string;
	tags: string[];
	date: string;
	type: 'lab' | 'project';
}
