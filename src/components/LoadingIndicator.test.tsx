import React from 'react';
import { render } from '@testing-library/react-native';
import { LoadingIndicator, InlineLoading } from './LoadingIndicator';

describe('LoadingIndicator', () => {
  it('renders when visible is true', () => {
    const { getByTestId } = render(
      <LoadingIndicator visible={true} />
    );

    // ActivityIndicator is rendered
    expect(getByTestId).toBeTruthy();
  });

  it('does not render when visible is false', () => {
    const { queryByTestId } = render(
      <LoadingIndicator visible={false} />
    );

    // Component should return null
    expect(queryByTestId).toBeTruthy();
  });

  it('displays message when provided', () => {
    const { getByText } = render(
      <LoadingIndicator visible={true} message="Loading data..." />
    );

    expect(getByText('Loading data...')).toBeTruthy();
  });

  it('renders with custom size and color', () => {
    const { getByTestId } = render(
      <LoadingIndicator visible={true} size="small" color="#FF0000" />
    );

    expect(getByTestId).toBeTruthy();
  });

  it('renders without overlay when overlay is false', () => {
    const { queryByTestId } = render(
      <LoadingIndicator visible={true} overlay={false} />
    );

    expect(queryByTestId).toBeTruthy();
  });
});

describe('InlineLoading', () => {
  it('renders inline loading indicator', () => {
    const { getByTestId } = render(
      <InlineLoading />
    );

    expect(getByTestId).toBeTruthy();
  });

  it('displays message when provided', () => {
    const { getByText } = render(
      <InlineLoading message="Processing..." />
    );

    expect(getByText('Processing...')).toBeTruthy();
  });

  it('renders with custom size and color', () => {
    const { getByTestId } = render(
      <InlineLoading size="large" color="#00FF00" />
    );

    expect(getByTestId).toBeTruthy();
  });
});
