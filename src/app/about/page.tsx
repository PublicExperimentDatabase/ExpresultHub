"use client"
import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import GitHubIcon from '@mui/icons-material/GitHub';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Header from '@/components/About/Header';
import MainFeaturedPost from '@/components/About/MainFeaturedPost';
import FeaturedPost from '@/components/About/FeaturedPost';
import Main from '@/components/About/Main';
import Sidebar from '@/components/About/SideBar';
import Footer from '@/components/About/Footer';

const sections = [
  { title: 'Technology', url: '#' },
  { title: 'Design', url: '#' },
  { title: 'Culture', url: '#' },
  { title: 'Business', url: '#' },
  { title: 'Politics', url: '#' },
  { title: 'Opinion', url: '#' },
  { title: 'Science', url: '#' },
  { title: 'Health', url: '#' },
  { title: 'Style', url: '#' },
  { title: 'Travel', url: '#' },
];

const mainFeaturedPost = {
  title: 'ExpresultHub',
  description:
    " The ExpresultHub project is a user-friendly web app designed to visualize and analyze command-line recorded experiments. It provides an intuitive dashboard for easy exploration of experiment data, enhancing accessibility and insights.",
  image: 'https://cdn270.picsart.com/52b663e2-18e7-4d08-ab1e-f131b380b0c5/434532819030201.jpg?to=fixed&r=160',
  imageText: 'main image description',
  linkText: '',
};

const featuredPosts = [
  {
    title: 'Mid Evaluation Post',
    date: 'Jul 31',
    description:
      'The Blog Post for our Mid-Term Evaluation describig our Milestones achieved as of July.',
    image: 'https://tse3.mm.bing.net/th?id=OIP.PdCSqmw-KBrNWpLdXKQ6twHaEK&pid=Api&P=0&h=180',
    imageLabel: 'Image Text',
    linkText:"https://ucsc-ospo.github.io/report/osre23/intel/artifactviz/20230731-zjyhhhhh/",
  },
  {
    title: 'End Evaluation Post',
    date: 'Nov 11',
    description:
      'This is a wider card with supporting text below as a natural lead-in to additional content.',
    image: 'https://source.unsplash.com/random?wallpapers',
    imageLabel: 'Image Text',
    linkText:"https://ucsc-ospo.github.io/report/osre23/intel/artifactviz/20230731-zjyhhhhh/"
  
  },
];

const sidebar = {
  title: 'About',
  description:
    'Etiam porta sem malesuada magna mollis euismod. Cras mattis consectetur purus sit amet fermentum. Aenean lacinia bibendum nulla sed consectetur.',
  archives: [
    { title: 'March 2020', url: '#' },
    { title: 'February 2020', url: '#' },
    { title: 'January 2020', url: '#' },
    { title: 'November 1999', url: '#' },
    { title: 'October 1999', url: '#' },
    { title: 'September 1999', url: '#' },
    { title: 'August 1999', url: '#' },
    { title: 'July 1999', url: '#' },
    { title: 'June 1999', url: '#' },
    { title: 'May 1999', url: '#' },
    { title: 'April 1999', url: '#' },
  ],
  social: [
    { name: 'GitHub', icon: GitHubIcon },
    { name: 'Twitter', icon: TwitterIcon },
    { name: 'Facebook', icon: FacebookIcon },
  ],
};
const defaultTheme = createTheme();

export default function Blog() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <main>
          <MainFeaturedPost post={mainFeaturedPost} />
          <Grid container spacing={4}>
            {featuredPosts.map((post) => (
              <FeaturedPost key={post.title} post={post} />
            ))}
          </Grid>
          <Grid container spacing={5} sx={{ mt: 3 }}>
            <Main/>
            <Sidebar
              title={sidebar.title}
              description={sidebar.description}
              social={sidebar.social}
            />
          </Grid>
        </main>
      </Container>
    </ThemeProvider>
  );
}