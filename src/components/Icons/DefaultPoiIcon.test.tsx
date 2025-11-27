import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DefaultPoiIcon, DefaultPoiIconSvg } from './DefaultPoiIcon';

describe('DefaultPoiIcon', () => {
  it('renders without crashing', () => {
    const { container } = render(<DefaultPoiIcon />);
    const svg = container.querySelector('svg');

    expect(svg).toBeInTheDocument();
  });

  it('exports valid SVG string', () => {
    expect(DefaultPoiIconSvg).toContain('<svg');
    expect(DefaultPoiIconSvg).toContain('</svg>');
  });
});
