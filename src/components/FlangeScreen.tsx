import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { flangeService } from '../services/FlangeService';
import { FlangeSpecification, FlangeStandard } from '../database/types';

type TabType = 'lookup' | 'pcd-search';

export const FlangeScreen: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('lookup');
  const [loading, setLoading] = useState(false);

  // Lookup tab state
  const [standards, setStandards] = useState<FlangeStandard[]>([]);
  const [selectedStandard, setSelectedStandard] = useState<FlangeStandard | null>(null);
  const [classes, setClasses] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [dns, setDns] = useState<number[]>([]);
  const [selectedDn, setSelectedDn] = useState<number | null>(null);
  const [flangeResult, setFlangeResult] = useState<FlangeSpecification | null>(null);

  // PCD search tab state
  const [pcdInput, setPcdInput] = useState('');
  const [toleranceInput, setToleranceInput] = useState('2');
  const [pcdResults, setPcdResults] = useState<FlangeSpecification[]>([]);

  // Load available standards on mount
  useEffect(() => {
    loadStandards();
  }, []);

  // Load classes when standard changes
  useEffect(() => {
    if (selectedStandard) {
      loadClasses(selectedStandard);
    }
  }, [selectedStandard]);

  // Load DNs when standard or class changes
  useEffect(() => {
    if (selectedStandard && selectedClass) {
      loadDns(selectedStandard, selectedClass);
    }
  }, [selectedStandard, selectedClass]);

  // Load flange when all parameters are selected
  useEffect(() => {
    if (selectedStandard && selectedClass && selectedDn !== null) {
      loadFlange(selectedDn, selectedStandard, selectedClass);
    }
  }, [selectedStandard, selectedClass, selectedDn]);

  const loadStandards = async () => {
    try {
      const availableStandards = await flangeService.getAvailableStandards();
      setStandards(availableStandards);
      if (availableStandards.length > 0) {
        setSelectedStandard(availableStandards[0]);
      }
    } catch (error) {
      console.error('Error loading standards:', error);
    }
  };

  const loadClasses = async (standard: FlangeStandard) => {
    try {
      const availableClasses = await flangeService.getAvailableClasses(standard);
      setClasses(availableClasses);
      setSelectedClass(availableClasses.length > 0 ? availableClasses[0] : null);
      setSelectedDn(null);
      setFlangeResult(null);
    } catch (error) {
      console.error('Error loading classes:', error);
    }
  };

  const loadDns = async (standard: FlangeStandard, flangeClass: string) => {
    try {
      const availableDns = await flangeService.getAvailableDNs(standard, flangeClass);
      setDns(availableDns);
      setSelectedDn(availableDns.length > 0 ? availableDns[0] : null);
    } catch (error) {
      console.error('Error loading DNs:', error);
    }
  };

  const loadFlange = async (dn: number, standard: FlangeStandard, flangeClass: string) => {
    try {
      setLoading(true);
      const result = await flangeService.getFlange(dn, standard, flangeClass);
      setFlangeResult(result);
    } catch (error) {
      console.error('Error loading flange:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePcdSearch = async () => {
    const pcd = parseFloat(pcdInput);
    const tolerance = parseFloat(toleranceInput);

    if (isNaN(pcd) || pcd <= 0) {
      return;
    }

    try {
      setLoading(true);
      const results = await flangeService.findByPCD(pcd, tolerance);
      setPcdResults(results);
    } catch (error) {
      console.error('Error searching by PCD:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderFlangeDetails = (flange: FlangeSpecification) => (
    <View style={styles.detailsContainer}>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{t('flange.dn')}:</Text>
        <Text style={styles.detailValue}>DN {flange.dn} ({flange.inches}")</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{t('flange.standard')}:</Text>
        <Text style={styles.detailValue}>{flange.standard}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{t('flange.class')}:</Text>
        <Text style={styles.detailValue}>{flange.class}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{t('flange.od')}:</Text>
        <Text style={styles.detailValue}>{flange.od} mm</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{t('flange.pcd')}:</Text>
        <Text style={styles.detailValue}>{flange.pcd} mm</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{t('flange.boltCount')}:</Text>
        <Text style={styles.detailValue}>{flange.boltCount}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{t('flange.boltSize')}:</Text>
        <Text style={styles.detailValue}>{flange.boltSize}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{t('flange.thickness')}:</Text>
        <Text style={styles.detailValue}>{flange.thickness} mm</Text>
      </View>
    </View>
  );

  const renderLookupTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.selectorContainer}>
        <Text style={styles.selectorLabel}>{t('flange.standard')}:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectorScroll}>
          {standards.map((standard: FlangeStandard) => (
            <TouchableOpacity
              key={standard}
              style={[
                styles.selectorButton,
                selectedStandard === standard && styles.selectorButtonActive,
              ]}
              onPress={() => setSelectedStandard(standard)}
            >
              <Text
                style={[
                  styles.selectorButtonText,
                  selectedStandard === standard && styles.selectorButtonTextActive,
                ]}
              >
                {standard}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {selectedStandard && (
        <View style={styles.selectorContainer}>
          <Text style={styles.selectorLabel}>{t('flange.class')}:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectorScroll}>
            {classes.map((cls: string) => (
              <TouchableOpacity
                key={cls}
                style={[
                  styles.selectorButton,
                  selectedClass === cls && styles.selectorButtonActive,
                ]}
                onPress={() => setSelectedClass(cls)}
              >
                <Text
                  style={[
                    styles.selectorButtonText,
                    selectedClass === cls && styles.selectorButtonTextActive,
                  ]}
                >
                  {cls}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {selectedStandard && selectedClass && (
        <View style={styles.selectorContainer}>
          <Text style={styles.selectorLabel}>{t('flange.dn')}:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectorScroll}>
            {dns.map((dn: number) => (
              <TouchableOpacity
                key={dn}
                style={[
                  styles.selectorButton,
                  selectedDn === dn && styles.selectorButtonActive,
                ]}
                onPress={() => setSelectedDn(dn)}
              >
                <Text
                  style={[
                    styles.selectorButtonText,
                    selectedDn === dn && styles.selectorButtonTextActive,
                  ]}
                >
                  DN {dn}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {loading && <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />}

      {!loading && flangeResult && renderFlangeDetails(flangeResult)}

      {!loading && !flangeResult && selectedStandard && selectedClass && selectedDn && (
        <Text style={styles.noResultText}>{t('flange.noResult')}</Text>
      )}
    </View>
  );

  const renderPcdSearchTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>{t('flange.pcdInput')}:</Text>
        <TextInput
          style={styles.input}
          value={pcdInput}
          onChangeText={setPcdInput}
          keyboardType="decimal-pad"
          placeholder={t('flange.pcdPlaceholder')}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>{t('flange.tolerance')}:</Text>
        <TextInput
          style={styles.input}
          value={toleranceInput}
          onChangeText={setToleranceInput}
          keyboardType="decimal-pad"
          placeholder="2"
        />
      </View>

      <TouchableOpacity style={styles.searchButton} onPress={handlePcdSearch}>
        <Text style={styles.searchButtonText}>{t('flange.search')}</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />}

      {!loading && pcdResults.length > 0 && (
        <ScrollView style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>
            {t('flange.resultsFound')}: {pcdResults.length}
          </Text>
          {pcdResults.map((flange: FlangeSpecification, index: number) => (
            <View key={`${flange.dn}-${flange.standard}-${flange.class}-${index}`} style={styles.resultCard}>
              {renderFlangeDetails(flange)}
            </View>
          ))}
        </ScrollView>
      )}

      {!loading && pcdInput && pcdResults.length === 0 && (
        <Text style={styles.noResultText}>{t('flange.noMatches')}</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'lookup' && styles.tabActive]}
          onPress={() => setActiveTab('lookup')}
        >
          <Text style={[styles.tabText, activeTab === 'lookup' && styles.tabTextActive]}>
            {t('flange.lookup')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'pcd-search' && styles.tabActive]}
          onPress={() => setActiveTab('pcd-search')}
        >
          <Text style={[styles.tabText, activeTab === 'pcd-search' && styles.tabTextActive]}>
            {t('flange.pcdSearch')}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'lookup' ? renderLookupTab() : renderPcdSearchTab()}
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  tabTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
  },
  selectorContainer: {
    marginBottom: 20,
  },
  selectorLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  selectorScroll: {
    flexGrow: 0,
  },
  selectorButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectorButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  selectorButtonText: {
    fontSize: 14,
    color: '#333',
  },
  selectorButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  detailsContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loader: {
    marginTop: 32,
  },
  noResultText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 32,
  },
  resultsContainer: {
    marginTop: 16,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  resultCard: {
    marginBottom: 16,
  },
});
