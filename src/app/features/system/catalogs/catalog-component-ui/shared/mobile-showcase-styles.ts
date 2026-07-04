export const MOBILE_SHOWCASE_STYLES = `
  .mobile-card {
    background: var(--ds-bg-surface);
    border: 1px solid var(--ds-border);
    border-radius: var(--ds-radius-lg);
    overflow: hidden;
  }

  .mobile-card-header {
    padding: 0.75rem 1rem;
    background: var(--ds-bg-elevated);
    font-weight: 600;
    font-size: var(--ds-font-size-body, 0.9375rem);
    color: var(--ds-text-primary);
    border-bottom: 1px solid var(--ds-border);
  }

  .mobile-card-body {
    padding: 1rem;
  }

  .section-label {
    font-weight: 700;
    font-size: 0.8125rem;
    color: var(--ds-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin-bottom: 0.25rem;
  }

  .section-desc {
    font-size: 0.75rem;
    color: var(--ds-text-muted);
    margin: 0 0 0.75rem 0;
    line-height: 1.4;
  }

  .stiich-section__title {
    font-size: 0.9375rem;
    font-weight: 700;
    color: var(--ds-text-primary);
    margin: 0;
  }

  /* 📱 Marco de teléfono para previsualizar componentes móviles como app real */
  .phone-frame {
    width: 100%;
    max-width: 340px;
    margin: 0 auto;
    background: var(--ds-bg-page);
    border: 8px solid var(--ds-text-primary);
    border-radius: 36px;
    box-shadow: var(--ds-shadow-lg);
    overflow: hidden;
    position: relative;
  }
  .phone-frame::before {
    content: "";
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 42%;
    height: 22px;
    background: var(--ds-text-primary);
    border-radius: 0 0 14px 14px;
    z-index: 2;
  }
  .phone-frame__screen {
    padding: 32px 12px 16px;
    min-height: 120px;
    max-height: 520px;
    overflow-y: auto;
  }
`;
