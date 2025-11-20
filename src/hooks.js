// hooks/useBookings.js
// Custom hook para gestão de marcações

import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

export const useBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Buscar todas as marcações
  const fetchBookings = async (filters = {}) => {
    try {
      setLoading(true)
      let query = supabase
        .from('bookings_detailed')
        .select('*')
        .order('booking_date', { ascending: true })

      // Aplicar filtros
      if (filters.date) {
        query = query.eq('booking_date', filters.date)
      }
      if (filters.status) {
        query = query.eq('status', filters.status)
      }
      if (filters.professionalId) {
        query = query.eq('professional_id', filters.professionalId)
      }

      const { data, error } = await query
      
      if (error) throw error
      setBookings(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Criar nova marcação
  const createBooking = async (bookingData) => {
    try {
      // 1. Verificar/criar cliente
      let { data: client, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('email', bookingData.email)
        .single()

      if (!client) {
        const { data: newClient, error: insertError } = await supabase
          .from('clients')
          .insert([{
            name: bookingData.name,
            email: bookingData.email,
            phone: bookingData.phone,
            notes: bookingData.clientNotes
          }])
          .select()
          .single()

        if (insertError) throw insertError
        client = newClient
      }

      // 2. Criar marcação
      const { data, error } = await supabase
        .from('bookings')
        .insert([{
          client_id: client.id,
          professional_id: bookingData.professionalId,
          service_id: bookingData.serviceId,
          booking_date: bookingData.date,
          start_time: bookingData.startTime,
          end_time: bookingData.endTime,
          status: 'pending',
          client_notes: bookingData.notes
        }])
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  // Atualizar marcação
  const updateBooking = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      await fetchBookings()
      return { success: true, data }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  // Cancelar marcação
  const cancelBooking = async (id, reason) => {
    return updateBooking(id, { 
      status: 'cancelled', 
      cancellation_reason: reason 
    })
  }

  // Confirmar marcação
  const confirmBooking = async (id) => {
    return updateBooking(id, { status: 'confirmed' })
  }

  // Completar marcação
  const completeBooking = async (id) => {
    return updateBooking(id, { status: 'completed' })
  }

  // Verificar disponibilidade
  const checkAvailability = async (professionalId, date, startTime, endTime) => {
    try {
      const { data, error } = await supabase
        .rpc('check_availability', {
          p_professional_id: professionalId,
          p_date: date,
          p_start_time: startTime,
          p_end_time: endTime
        })

      if (error) throw error
      return data
    } catch (err) {
      console.error('Error checking availability:', err)
      return false
    }
  }

  // Obter horários disponíveis
  const getAvailableSlots = async (professionalId, date, duration) => {
    try {
      const { data, error } = await supabase
        .rpc('get_available_slots', {
          p_professional_id: professionalId,
          p_date: date,
          p_duration: duration
        })

      if (error) throw error
      return data
    } catch (err) {
      console.error('Error getting available slots:', err)
      return []
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    createBooking,
    updateBooking,
    cancelBooking,
    confirmBooking,
    completeBooking,
    checkAvailability,
    getAvailableSlots
  }
}

// hooks/useServices.js
export const useServices = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchServices = async (activeOnly = true) => {
    try {
      setLoading(true)
      let query = supabase.from('services').select('*')
      
      if (activeOnly) {
        query = query.eq('is_active', true)
      }
      
      const { data, error } = await query.order('category', { ascending: true })
      
      if (error) throw error
      setServices(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createService = async (serviceData) => {
    try {
      const { data, error } = await supabase
        .from('services')
        .insert([serviceData])
        .select()
        .single()

      if (error) throw error
      await fetchServices()
      return { success: true, data }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const updateService = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('services')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      await fetchServices()
      return { success: true, data }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const deleteService = async (id) => {
    try {
      // Soft delete - marcar como inativo
      const { error } = await supabase
        .from('services')
        .update({ is_active: false })
        .eq('id', id)

      if (error) throw error
      await fetchServices()
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  return {
    services,
    loading,
    error,
    fetchServices,
    createService,
    updateService,
    deleteService
  }
}

// hooks/useProfessionals.js
export const useProfessionals = () => {
  const [professionals, setProfessionals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProfessionals = async (activeOnly = true) => {
    try {
      setLoading(true)
      let query = supabase
        .from('professionals')
        .select(`
          *,
          professional_services (
            service_id,
            services (*)
          )
        `)
      
      if (activeOnly) {
        query = query.eq('is_active', true)
      }
      
      const { data, error } = await query
      
      if (error) throw error
      setProfessionals(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createProfessional = async (professionalData) => {
    try {
      const { data, error } = await supabase
        .from('professionals')
        .insert([professionalData])
        .select()
        .single()

      if (error) throw error
      await fetchProfessionals()
      return { success: true, data }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const updateProfessional = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('professionals')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      await fetchProfessionals()
      return { success: true, data }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const assignServiceToProfessional = async (professionalId, serviceId) => {
    try {
      const { data, error } = await supabase
        .from('professional_services')
        .insert([{
          professional_id: professionalId,
          service_id: serviceId
        }])
        .select()

      if (error) throw error
      await fetchProfessionals()
      return { success: true, data }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const removeServiceFromProfessional = async (professionalId, serviceId) => {
    try {
      const { error } = await supabase
        .from('professional_services')
        .delete()
        .eq('professional_id', professionalId)
        .eq('service_id', serviceId)

      if (error) throw error
      await fetchProfessionals()
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  useEffect(() => {
    fetchProfessionals()
  }, [])

  return {
    professionals,
    loading,
    error,
    fetchProfessionals,
    createProfessional,
    updateProfessional,
    assignServiceToProfessional,
    removeServiceFromProfessional
  }
}

// hooks/useWorkingHours.js
export const useWorkingHours = () => {
  const [workingHours, setWorkingHours] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchWorkingHours = async (professionalId) => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('working_hours')
        .select('*')
        .eq('professional_id', professionalId)
        .order('day_of_week', { ascending: true })

      if (error) throw error
      setWorkingHours(data)
    } catch (err) {
      console.error('Error fetching working hours:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateWorkingHours = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('working_hours')
        .update(updates)
        .eq('id', id)
        .select()

      if (error) throw error
      return { success: true, data }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  return {
    workingHours,
    loading,
    fetchWorkingHours,
    updateWorkingHours
  }
}
