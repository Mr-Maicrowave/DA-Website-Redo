import LocationPageTemplate from '@/components/location/LocationPageTemplate';
import { getLocationBySlug } from '@/data/locations';

const Lansvale = () => {
    const content = getLocationBySlug('lansvale');
    if (!content) return null;
    return <LocationPageTemplate content={content} />;
};

export default Lansvale;
