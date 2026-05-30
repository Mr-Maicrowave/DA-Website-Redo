import LocationPageTemplate from '@/components/location/LocationPageTemplate';
import { getLocationBySlug } from '@/data/locations';

const Cabramatta = () => {
    const content = getLocationBySlug('cabramatta');
    if (!content) return null;
    return <LocationPageTemplate content={content} />;
};

export default Cabramatta;
