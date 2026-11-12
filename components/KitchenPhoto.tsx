import Image from 'next/image';
import { isKitchenPlaceholder, type KitchenPhoto as KitchenPhotoData } from '@/data/kitchen-team';
import s from './KitchenTeam.module.scss';

/** All text sits outside the photograph. Never retouch or tint people. */
export default function KitchenPhoto({ photo, sizes }: { photo: KitchenPhotoData; sizes: string }) {
  if (isKitchenPlaceholder(photo)) {
    return <div className={s.placeholder} role="img" aria-label={`Photo placeholder: ${photo.shot}. Awaiting an original MIKLOL photograph.`}>
      <Image src={photo.src} alt="" width={60} height={60} className={s.placeholderIcon} aria-hidden="true" />
      <span className={s.placeholderTitle}>{photo.shot}</span>
      <span className={s.placeholderNote}>Original photo coming soon</span>
      <span className={s.placeholderTag}>PHOTO PLACEHOLDER</span>
    </div>;
  }
  return <Image src={photo.src} alt={photo.alt} fill sizes={sizes} className={s.photograph} />;
}
