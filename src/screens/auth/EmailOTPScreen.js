import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Input from '../../components/common/Input';
import { sendOTP } from '../../services/otpService';

const EmailOTPScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleSendOTP = async () => {
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const result = await sendOTP(email.trim().toLowerCase());

      if (result.success) {
        navigation.navigate('OTPVerify', {
          email: email.trim().toLowerCase(),
          cooldownSeconds: result.cooldownSeconds || 60,
          devOtp: result.devOtp || null,
        });
      } else {
        setError(result.error || 'Failed to send OTP. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#0A1628', '#0D3B0F', '#1B5E20']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.topSection}
      >
        <View style={styles.starsContainer}>
          {[...Array(20)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.star,
                {
                  left: `${(i * 5.3) % 100}%`,
                  top: `${(i * 7.1 + 5) % 90}%`,
                  width: 2 + (i % 3),
                  height: 2 + (i % 3),
                  opacity: 0.3 + (i % 4) * 0.15,
                },
              ]}
            />
          ))}
        </View>

        <View style={styles.logoContainer}>
          <View style={styles.logoGlow}>
            <LinearGradient
              colors={['#D4AF37', '#F5E6B8', '#D4AF37']}
              style={styles.logoCircle}
            >
              <Ionicons name="moon" size={42} color="#0A1628" />
            </LinearGradient>
          </View>
          <Text style={styles.appName}>Deen App</Text>
          <Text style={styles.tagline}>Your Faith, Your Community</Text>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.formSection}
      >
        <View style={styles.formCard}>
          <View style={styles.iconHeader}>
            <View style={styles.emailIconCircle}>
              <Ionicons name="mail" size={28} color="#1B5E20" />
            </View>
          </View>

          <Text style={styles.titleText}>Email Verification</Text>
          <Text style={styles.subtitleText}>
            Enter your email address to receive a 6-digit verification code
          </Text>

          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={16} color="#E53935" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Input
            label="Email Address"
            placeholder="Enter your email"
            value={email}
            onChangeText={(val) => { setEmail(val); setError(''); }}
            keyboardType="email-address"
            icon="mail-outline"
          />

          <TouchableOpacity
            style={[styles.sendButton, loading && styles.sendButtonDisabled]}
            onPress={handleSendOTP}
            disabled={loading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={loading ? ['#999', '#888'] : ['#1B5E20', '#2E7D32']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.sendButtonGradient}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <>
                  <Ionicons name="send" size={18} color="#FFF" style={{ marginRight: 8 }} />
                  <Text style={styles.sendButtonText}>Send Verification Code</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={18} color="#1B5E20" />
            <Text style={styles.backButtonText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  topSection: {
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  starsContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  star: {
    position: 'absolute',
    backgroundColor: '#FFF',
    borderRadius: 10,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoGlow: {
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 20,
    marginBottom: 12,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 13,
    color: '#A5D6A7',
    marginTop: 4,
    fontStyle: 'italic',
  },
  formSection: {
    flex: 1,
    marginTop: -30,
  },
  formCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  iconHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  emailIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    color: '#E53935',
    fontSize: 13,
    flex: 1,
  },
  sendButton: {
    marginTop: 8,
  },
  sendButtonDisabled: {
    opacity: 0.7,
  },
  sendButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
  },
  sendButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 6,
  },
  backButtonText: {
    color: '#1B5E20',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default EmailOTPScreen;
