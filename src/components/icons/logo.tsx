import Image from 'next/image';

import glucometer from '@/assets/images/glucometer.png';

interface Props {
  size?: number;
}

export default function Logo({ size = 40 }: Props) {
  return (
    <Image
      src={glucometer}
      height={size}
      width={size}
      alt="Imagem de aparelho medidor de glicemia"
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    />
  );
}
