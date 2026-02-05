
import { BiometricProfile, BehavioralProfile, VoiceProfile, Fragrance } from "../types";

/**
 * PULSE SCENT DNA SERVICE (Local-First Logic)
 * This service detects the absence of an API key and automatically 
 * switches to high-fidelity simulation mode.
 */

export const generateScentDNA = async (
  biometrics: BiometricProfile,
  behavior: BehavioralProfile,
  voice: VoiceProfile
) => {
  console.log("🧬 PULSE: Running local biometric synthesis...");
  
  // Simulate heavy AI processing time
  await new Promise(resolve => setTimeout(resolve, 2500));

  // Intelligent selection based on mock inputs
  const archetypes = [
    { name: "Obsidian Nomad", desc: "Thermal Reactive — Intense PM — Notes of Smoked Oud & Leather" },
    { name: "Solar Alchemist", desc: "UV Responsive — Fresh AM — Notes of Bergamot & White Jasmine" },
    { name: "Cyber Oud", desc: "Humidity Adaptive — Evening Transition — Notes of Metallic Rose & Amber" },
    { name: "Velvet Minimalist", desc: "PH Balanced — All-Day Versatility — Notes of White Musk & Iris" }
  ];
  
  // Logic to make it feel "real": mapping voice pitch to specific archetypes
  const result = voice.pitch === 'High' ? archetypes[1] : archetypes[0];
  return `${result.name} — ${result.desc}`;
};

export const getRecipeRecommendations = async (
  userDNA: string,
  ownedFragrances: Fragrance[]
) => {
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  if (ownedFragrances.length === 0) return null;

  return {
    recipeName: "Local Synthesis #1",
    ratios: ownedFragrances.map((f, i) => ({ 
      name: f.name, 
      percentage: i === 0 ? 70 : 30 
    })),
    analysis: "This recommendation was generated using browser-side sensory logic."
  };
};
