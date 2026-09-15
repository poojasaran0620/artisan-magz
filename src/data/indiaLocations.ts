export const INDIAN_STATES: readonly string[] = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
] as const;

export interface PincodeHint {
  city?: string;
  state: string;
}

// Quick state & metro detection by pincode 2-digit prefix
export function getPincodeHint(pincode: string): PincodeHint | null {
  const clean = pincode.replace(/\D/g, '');
  if (clean.length < 2) return null;

  const prefix2 = clean.slice(0, 2);

  switch (prefix2) {
    case '11':
      return { city: 'New Delhi', state: 'Delhi' };
    case '12':
    case '13':
      return { state: 'Haryana' };
    case '14':
    case '15':
      return { state: 'Punjab' };
    case '16':
      return { city: 'Chandigarh', state: 'Chandigarh' };
    case '17':
      return { state: 'Himachal Pradesh' };
    case '18':
    case '19':
      return { state: 'Jammu and Kashmir' };
    case '20':
    case '21':
    case '22':
    case '23':
    case '24':
    case '25':
    case '26':
    case '27':
    case '28':
      return { state: 'Uttar Pradesh' };
    case '30':
    case '31':
    case '32':
    case '33':
    case '34':
      return { state: 'Rajasthan' };
    case '36':
    case '37':
    case '38':
    case '39':
      return { state: 'Gujarat' };
    case '40':
      return { city: 'Mumbai', state: 'Maharashtra' };
    case '41':
      return { city: 'Pune', state: 'Maharashtra' };
    case '42':
    case '43':
    case '44':
      return { state: 'Maharashtra' };
    case '45':
    case '46':
    case '47':
    case '48':
      return { state: 'Madhya Pradesh' };
    case '49':
      return { state: 'Chhattisgarh' };
    case '50':
      return { city: 'Hyderabad', state: 'Telangana' };
    case '51':
    case '52':
    case '53':
      return { state: 'Andhra Pradesh' };
    case '56':
      return { city: 'Bengaluru', state: 'Karnataka' };
    case '57':
    case '58':
    case '59':
      return { state: 'Karnataka' };
    case '60':
      return { city: 'Chennai', state: 'Tamil Nadu' };
    case '61':
    case '62':
    case '63':
    case '64':
      return { state: 'Tamil Nadu' };
    case '67':
    case '68':
    case '69':
      return { state: 'Kerala' };
    case '70':
      return { city: 'Kolkata', state: 'West Bengal' };
    case '71':
    case '72':
    case '73':
    case '74':
      return { state: 'West Bengal' };
    case '75':
    case '76':
    case '77':
      return { state: 'Odisha' };
    case '78':
      return { state: 'Assam' };
    case '79':
      return { state: 'North Eastern States' };
    case '80':
    case '81':
    case '82':
    case '83':
    case '84':
    case '85':
      return { state: 'Bihar' };
    default:
      return null;
  }
}
