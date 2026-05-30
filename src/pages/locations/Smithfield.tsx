import LocationPageTemplate from '@/components/location/LocationPageTemplate';
import { getLocationBySlug } from '@/data/locations';

const Smithfield = () => {
    const content = getLocationBySlug('smithfield');
    if (!content) return null;
    return <LocationPageTemplate content={content} />;
};

export default Smithfield;
