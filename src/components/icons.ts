import type { ComponentType } from 'react';

/**
 * Any icon from the project's single icon library (lucide-react-native).
 * Kept deliberately loose so forwardRef-based icons satisfy it.
 */
export type IconComponent = ComponentType<any>;
