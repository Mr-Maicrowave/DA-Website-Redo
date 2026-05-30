import LocationPageTemplate from '@/components/location/LocationPageTemplate';
import { getLocationBySlug } from '@/data/locations';

const CanleyVale = () => {
    const content = getLocationBySlug('canley-vale');
    if (!content) return null;
    return <LocationPageTemplate content={content} />;
};

export default CanleyVale;
