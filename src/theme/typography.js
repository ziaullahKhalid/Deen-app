import { Platform } from 'react-native';

const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  web: 'Inter, system-ui, -apple-system, sans-serif',
});

export const Typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily,
  },
  h4: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily,
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily,
    letterSpacing: 0.5,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily,
  },
};
