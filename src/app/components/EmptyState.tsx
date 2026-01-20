import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-20"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <Icon className="w-24 h-24 mx-auto mb-6 text-muted-foreground" />
      </motion.div>
      <h2 className="text-3xl font-bold mb-4">{title}</h2>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button size="lg" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};
