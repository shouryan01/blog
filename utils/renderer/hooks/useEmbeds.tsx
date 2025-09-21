'use client';

import { useEffect } from 'react';
import { loadIframeResizer } from '../services/embed';

interface UseEmbedsOptions {
  enabled?: boolean;
}

export const useEmbeds = ({ enabled = true }: UseEmbedsOptions = {}) => {
  useEffect(() => {
    if (enabled) {
      loadIframeResizer();
    }
  }, [enabled]);
};