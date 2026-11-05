import './globals.css';
import localFont from 'next/font/local';
const space=localFont({src:'../assets/fonts/space-grotesk.ttf',variable:'--font-space',weight:'300 700',display:'swap'});
export const metadata={title:'Got Plans? SG — Singapore events',description:'Discover social events, arts, markets and outdoor adventures in Singapore. A weekly guide for newcomers, expats and locals.'};
export const viewport={width:'device-width',initialScale:1,viewportFit:'cover',themeColor:'#151417',colorScheme:'dark'};
export default function RootLayout({children}){return <html lang="en" className={space.variable}><body>{children}</body></html>}
