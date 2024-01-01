// TrainingCatalog.js
import { useState, useEffect } from 'react';
import { Grid, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import TrainingCard from './TrainingCard';
import { getFormations } from '../api/api';

const TrainingCatalog = () => {
    
  const [formationsData, setFormationsData] = useState([]);
  const [domainFilter, setDomainFilter] = useState('Tous');
  const [levelFilter, setLevelFilter] = useState('Tous');
  const [availabilityFilter, setAvailabilityFilter] = useState('Tous');

  useEffect(() => {
    const fetchTrainingData = async () => {
      try {
        const formations = await getFormations();
        setFormationsData(formations);
      } catch (error) {
        console.error('Error fetching training data', error);
      }
    };

    fetchTrainingData();
  }, []); 

  const filteredTraining = formationsData.filter((training) => {
    const matchDomain = domainFilter === 'Tous' || training.domaine === domainFilter;
    const matchLevel = levelFilter === 'Tous' || training.niveau === levelFilter;
    const matchAvailability = availabilityFilter === 'Tous' || training.disponible === availabilityFilter;

    return matchDomain && matchLevel && matchAvailability;
  });

  const uniqueDomains = Array.from(new Set(formationsData.map((training) => training.domaine)));
  const uniqueLevels = Array.from(new Set(formationsData.map((training) => training.niveau)));
  const uniqueAvailabilities = Array.from(new Set(formationsData.map((training) => training.disponible)));

  return (
    <div>
    <Grid container>
      <Grid container >
      <Grid item xs={12} md={4} marginTop={3}>
        <FormControl fullWidth >
          <InputLabel id="domain-filter-label">Domaine</InputLabel>
          <Select
            labelId="domain-filter-label"
            id="domain-filter"
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
          >
            <MenuItem value="Tous">Tous</MenuItem>
            {uniqueDomains.map((domain) => (
              <MenuItem key={domain} value={domain}>
                {domain}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={4} marginTop={3}>
        <FormControl fullWidth>
          <InputLabel id="level-filter-label">Niveau</InputLabel>
          <Select
            labelId="level-filter-label"
            id="level-filter"
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
          >
            <MenuItem value="Tous">Tous</MenuItem>
            {uniqueLevels.map((level) => (
              <MenuItem key={level} value={level}>
                {level}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={4} marginTop={3}>
        <FormControl fullWidth>
          <InputLabel id="availability-filter-label">Disponibilité</InputLabel>
          <Select
            labelId="availability-filter-label"
            id="availability-filter"
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
          >
            <MenuItem value="Tous">Tous</MenuItem>
            {uniqueAvailabilities.map((availability) => (
              <MenuItem key={availability} value={availability}>
                {availability ? 'Disponible' : 'Indisponible'}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>

      <Grid container spacing={2} marginTop={2}>
        {filteredTraining.map((training) => (
          <Grid key={training.id} item xs={12} sm={6} md={4}>
            <TrainingCard training={training} />
          </Grid>
        ))}
      </Grid>
    </Grid>

    </div>
  );
};

export default TrainingCatalog;
