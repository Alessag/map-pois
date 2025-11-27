import { fireEvent, render } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
  test('should render search input with placeholder', () => {
    const { getByPlaceholderText } = render(<SearchBar />);

    const input = getByPlaceholderText('Search POIs by name or category');

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
  });

  test('should update input value immediately on change', () => {
    const { getByPlaceholderText } = render(<SearchBar />);

    const input = getByPlaceholderText('Search POIs by name or category');

    fireEvent.change(input, { target: { value: 'test' } });

    expect(input).toHaveValue('test');
  });

  test('should not show clear button when input is empty', () => {
    const { queryByLabelText } = render(<SearchBar />);

    const clearButton = queryByLabelText('Clear search');

    expect(clearButton).not.toBeInTheDocument();
  });

  test('should show clear button when input has value', () => {
    const { queryByLabelText, getByPlaceholderText, getByLabelText } = render(<SearchBar />);

    const input = getByPlaceholderText('Search POIs by name or category');

    expect(queryByLabelText('Clear search')).not.toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'coffee' } });

    const clearButton = getByLabelText('Clear search');

    expect(clearButton).toBeInTheDocument();
  });

  test('should render SearchIcon component', () => {
    render(<SearchBar />);

    const searchIcon = document.querySelector('svg');

    expect(searchIcon).toBeInTheDocument();
  });
});
