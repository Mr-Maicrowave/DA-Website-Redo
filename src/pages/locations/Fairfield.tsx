import LocationPageTemplate from '@/components/location/LocationPageTemplate';
import { getLocationBySlug } from '@/data/locations';

const Fairfield = () => {
    const content = getLocationBySlug('fairfield');
    if (!content) return null;
    return <LocationPageTemplate content={content} />;
};

export default Fairfield;
