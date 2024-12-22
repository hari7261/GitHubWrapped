import Image from 'next/image';
import hariom from '../app/images/hari7261_github_wrapped (5).png';
import devanand from '../app/images/Devanand004_github_wrapped.png';
import himanshu from '../app/images/whitedevil9911_github_wrapped.png';
import ashwin from '../app/images/ashwin925_github_wrapped.png'
import Anuj from '../app/images/anujchaudhary001_github_wrapped.png';
import jsMastery from '../app/images/adrianhajdin_github_wrapped.png';

export function FeaturedProfiles() {
  const profiles = [
    {
      username: '@hari7261',
      name: 'Hariom Kumar pandit',
      image: hariom,
      description: 'Creator of the wrapped',
      feedback: 'GitHub Wrapped is an amazing way to visualize my coding journey!',
    },
    {
      username: '@whitedevil9911',
      name: 'Himanshu',
      image: himanshu,
      description: 'Linux kernel maintainer',
      feedback: 'This is a brilliant tool for developers to showcase their work!',
    },
    {
      username: '@devanand004',
      name: 'Devanand ',
      image: devanand,
      description: 'Vue.js creator',
      feedback: 'I love how intuitive and visually stunning GitHub Wrapped is!',
    },
    {
      username: '@ashwin925',
      name: 'Ashwin sundar',
      image: ashwin,
      description: 'fullstack dev',
      feedback: 'I love how intuitive and visually stunning GitHub Wrapped is!',
    },
    {
      username: '@anujchaudhary001',
      name: 'Anuj Chaudhary',
      image: Anuj,
      description: 'Backend  dev',
      feedback: 'wow it really fantastic and see how cool is it.!',
    },
    {
      username: '@adrianhajdin',
      name: 'JavaScript Mastery',
      image: jsMastery,
      description: 'JavaScript expert',
      feedback: 'GitHub Wrapped is a fantastic tool for developers to showcase their work!',
    }
  ];

  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
        Featured Profiles
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {profiles.map((profile) => (
          <div
            key={profile.username}
            className="rounded-lg bg-gray-900/50 backdrop-blur-sm border border-gray-800 shadow-lg"
          >
            {/* Image Section */}
            <div className="overflow-hidden rounded-t-lg">
              <Image
                src={profile.image}
                alt={`${profile.name}'s showcase`}
                width={400}
                height={200}
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Content Section */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-purple-400">{profile.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{profile.username}</p>
              <p className="text-gray-400 text-sm mb-4">{profile.description}</p>
              <blockquote className="text-sm italic text-gray-300">"{profile.feedback}"</blockquote>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
