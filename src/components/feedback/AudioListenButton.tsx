import { ListenButton } from '../../ui/ListenButton';

interface AudioListenButtonProps {
  textToSpeak: string;
  label?: string;
  /** Kept for API compatibility — the Aangan ListenButton has one comfortable 40–44px size. */
  size?: 'sm' | 'md' | 'lg';
  variant?: 'pill' | 'button' | 'icon';
  className?: string;
}

/**
 * Compatibility wrapper. Older screens call <AudioListenButton textToSpeak=… />;
 * they now render the Aangan "Suniye" ListenButton (dancing bars while speaking).
 */
export function AudioListenButton({ textToSpeak, label, variant = 'pill', className }: AudioListenButtonProps) {
  return <ListenButton text={textToSpeak} label={label} variant={variant === 'icon' ? 'icon' : 'pill'} className={className} />;
}

export default AudioListenButton;
