  const fetchReports = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8080/api/client/reports',
        { withCredentials: true }
      );
      setReports(response.data);
    } catch (error) {
      console.error('Eroare la incarcarea dosarelor', error);
    }
  };
