'use client';

import { useEffect, useState } from 'react';
// @ts-ignore
import handleMathJax from '../../utils/handle-math-jax';
import { useEmbeds } from '../../utils/renderer/hooks/useEmbeds';
import { loadIframeResizer } from '../../utils/renderer/services/embed';
// @ts-ignore
import { triggerCustomWidgetEmbed } from '../../utils/trigger-custom-widget-embed';
import { PostFullFragment } from '../../generated/graphql';

type Props = {
  post: PostFullFragment | null;
};

export function PostOrPageClient({ post }: Props) {
  const [, setMobMount] = useState(false);
  const [canLoadEmbeds, setCanLoadEmbeds] = useState(false);
  useEmbeds({ enabled: canLoadEmbeds });

  useEffect(() => {
    if (!post) return;

    if (post.hasLatexInPost) {
      setTimeout(() => {
        handleMathJax(true);
      }, 500);
    }

    (async () => {
      await loadIframeResizer();
      triggerCustomWidgetEmbed(post.publication?.id.toString());
      setCanLoadEmbeds(true);
    })();
  }, [post]);

  return null;
}
