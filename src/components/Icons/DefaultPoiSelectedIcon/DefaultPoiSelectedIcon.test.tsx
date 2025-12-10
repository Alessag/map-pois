import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DefaultPoiSelectedIcon, DefaultPoiSelectedIconSvg } from './DefaultPoiSelectedIcon';

describe('DefaultPoiSelectedIcon', () => {
  it('renders without crashing', () => {
    const { container } = render(<DefaultPoiSelectedIcon />);
    const svg = container.querySelector('svg');

    expect(svg).toBeInTheDocument();
  });

  it('exports valid SVG string', () => {
    expect(DefaultPoiSelectedIconSvg).toContain('<svg');
    expect(DefaultPoiSelectedIconSvg).toContain('</svg>');
  });
});
