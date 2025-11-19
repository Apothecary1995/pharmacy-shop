import React from 'react';


const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.content}>
        <p> <a href="#" style={styles.link}>Kullanım Şartları</a></p>
        <div style={styles.socials}>
          <a href="#" style={styles.link}>Twitter</a> | 
          <a href="#" style={styles.link}>LinkedIn</a> | 
          <a href="#" style={styles.link}>Instagram</a>
        </div>
      </div>
    </footer>
  );
};


const styles = {
  footer: {
    
    backgroundColor: 'rgba(0, 0, 0, 0.4)', 
    color: '#ecf0f1',
    padding: '20px 0 70px 0',
    textAlign: 'center',
    fontSize: '0.9em',
    marginTop: 'auto', 
    position: 'absolute',
    bottom:0,
    zIndex: 100, 
  },
  content: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 20px',
  },
  socials: {
    marginTop: '10px',
  },
  link: {
    color: '#3498db',
    textDecoration: 'none',
    margin: '0 5px',
    fontWeight: 'bold',
  }
};

export default Footer;